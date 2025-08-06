package com.yin.yin.service.impl;

import com.yin.yin.common.PageResult;
import com.yin.yin.mapper.PackageMapper;
import com.yin.yin.model.Package;
import com.yin.yin.model.PackageType;
import com.yin.yin.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 套餐服务实现类
 */
@Service
public class PackageServiceImpl implements PackageService {

    @Autowired
    private PackageMapper packageMapper;

    @Override
    public Package getPackageDetail(Long id) {
        return packageMapper.selectById(id);
    }

    @Override
    public PageResult<Package> listPackages(String keyword, Integer type, Integer pageNum, Integer pageSize) {
        // 计算分页参数
        Integer offset = (pageNum - 1) * pageSize;
        Integer limit = pageSize;

        // 查询套餐列表
        List<Package> packages = packageMapper.selectList(keyword, type, offset, limit);

        // 查询总数
        Long total = packageMapper.selectCount(keyword, type);

        return new PageResult<>(total, packages);
    }

    @Override
    public List<PackageType> getAllTypes() {
        return packageMapper.selectAllTypes();
    }

    @Override
    public int addPackage(Package pkg) {
        // 设置默认值
        if (pkg.getStatus() == null) {
            pkg.setStatus(1);
        }
        if (pkg.getIsHot() == null) {
            pkg.setIsHot(false);
        }
        if (pkg.getIsRecommended() == null) {
            pkg.setIsRecommended(false);
        }
        if (pkg.getSalesCount() == null) {
            pkg.setSalesCount(0);
        }

        // 设置类型名称
        if (pkg.getType() != null) {
            PackageType type = packageMapper.selectTypeById(pkg.getType());
            if (type != null) {
                pkg.setTypeName(type.getName());
            }
        }

        pkg.setCreateTime(new Date());
        pkg.setUpdateTime(new Date());

        return packageMapper.insert(pkg);
    }

    @Override
    public int updatePackage(Package pkg) {
        // 设置类型名称
        if (pkg.getType() != null) {
            PackageType type = packageMapper.selectTypeById(pkg.getType());
            if (type != null) {
                pkg.setTypeName(type.getName());
            }
        }

        pkg.setUpdateTime(new Date());

        return packageMapper.update(pkg);
    }

    @Override
    public int deletePackage(Long id) {
        return packageMapper.deleteById(id);
    }
}
