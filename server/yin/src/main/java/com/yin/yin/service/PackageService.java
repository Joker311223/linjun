package com.yin.yin.service;

import com.yin.yin.common.PageResult;
import com.yin.yin.model.Package;
import com.yin.yin.model.PackageType;

import java.util.List;

/**
 * 套餐服务接口
 */
public interface PackageService {
    /**
     * 获取套餐详情
     */
    Package getPackageDetail(Long id);

    /**
     * 分页查询套餐列表
     */
    PageResult<Package> listPackages(String keyword, Integer type, Integer pageNum, Integer pageSize);

    /**
     * 获取所有套餐类型
     */
    List<PackageType> getAllTypes();

    /**
     * 添加套餐
     */
    int addPackage(Package pkg);

    /**
     * 更新套餐
     */
    int updatePackage(Package pkg);

    /**
     * 删除套餐
     */
    int deletePackage(Long id);
}
