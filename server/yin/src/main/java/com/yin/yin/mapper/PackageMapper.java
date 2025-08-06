package com.yin.yin.mapper;

import com.yin.yin.model.Package;
import com.yin.yin.model.PackageType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 套餐Mapper接口
 */
@Mapper
public interface PackageMapper {
    /**
     * 根据ID查询套餐
     */
    Package selectById(Long id);

    /**
     * 查询套餐列表
     */
    List<Package> selectList(@Param("keyword") String keyword,
                            @Param("type") Integer type,
                            @Param("offset") Integer offset,
                            @Param("limit") Integer limit);

    /**
     * 查询套餐总数
     */
    Long selectCount(@Param("keyword") String keyword, @Param("type") Integer type);

    /**
     * 插入套餐
     */
    int insert(Package pkg);

    /**
     * 更新套餐
     */
    int update(Package pkg);

    /**
     * 删除套餐
     */
    int deleteById(Long id);

    /**
     * 查询所有套餐类型
     */
    List<PackageType> selectAllTypes();

    /**
     * 根据ID查询套餐类型
     */
    PackageType selectTypeById(Integer id);
}
